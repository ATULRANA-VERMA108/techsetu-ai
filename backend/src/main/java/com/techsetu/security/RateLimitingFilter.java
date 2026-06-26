package com.techsetu.security;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RateLimitingFilter implements Filter {

    private static class RequestLog {
        long timestamp;
        int count;
        RequestLog(long timestamp, int count) {
            this.timestamp = timestamp;
            this.count = count;
        }
    }

    // IP -> LimitType -> RequestLog
    private final Map<String, Map<String, RequestLog>> ipRequestLogs = new ConcurrentHashMap<>();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // Bypass checks for HTTP preflight OPTIONS requests
        if ("OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        String ip = httpRequest.getRemoteAddr();
        String path = httpRequest.getRequestURI();

        // Determine rate limit parameters based on paths (auth vs AI vs general)
        long windowMs;
        int maxRequests;
        String limitType;

        if (path.startsWith("/api/auth/")) {
            // Auth endpoints (signin, signup, forgot password): 5 requests per 15 minutes per IP
            windowMs = 15 * 60 * 1000;
            maxRequests = 5;
            limitType = "auth";
        } else if (path.startsWith("/api/ai/") || path.startsWith("/api/questions/")) {
            // AI / LLM proxy endpoints: 10 requests per minute per IP
            windowMs = 60 * 1000;
            maxRequests = 10;
            limitType = "ai";
        } else if (path.startsWith("/api/")) {
            // General API routes: 60 requests per minute per IP
            windowMs = 60 * 1000;
            maxRequests = 60;
            limitType = "general";
        } else {
            // Bypass filtering for non-API requests (static frontend files, etc.)
            chain.doFilter(request, response);
            return;
        }

        long now = System.currentTimeMillis();
        Map<String, RequestLog> logs = ipRequestLogs.computeIfAbsent(ip, k -> new ConcurrentHashMap<>());
        RequestLog log = logs.get(limitType);

        if (log == null || (now - log.timestamp) > windowMs) {
            logs.put(limitType, new RequestLog(now, 1));
        } else {
            if (log.count >= maxRequests) {
                long retryAfterSeconds = ((log.timestamp + windowMs) - now) / 1000;
                if (retryAfterSeconds <= 0) retryAfterSeconds = 1;
                
                httpResponse.setStatus(429); // Too Many Requests
                httpResponse.setHeader("Retry-After", String.valueOf(retryAfterSeconds));
                httpResponse.setContentType("application/json");
                httpResponse.getWriter().write("{\"error\":\"Too Many Requests\",\"message\":\"Rate limit exceeded. Try again in " + retryAfterSeconds + " seconds.\"}");
                return;
            }
            log.count++;
        }

        chain.doFilter(request, response);
    }
}
