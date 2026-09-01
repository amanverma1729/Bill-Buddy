package com.aman.split_with_room_mates;

import java.io.IOException;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class UrlNormalizationFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        if (request instanceof HttpServletRequest httpRequest) {
            String requestURI = httpRequest.getRequestURI();
            if (requestURI != null && requestURI.contains("//")) {
                String normalizedURI = requestURI.replaceAll("/{2,}", "/");
                HttpServletRequest wrappedRequest = new HttpServletRequestWrapper(httpRequest) {
                    @Override
                    public String getRequestURI() {
                        return normalizedURI;
                    }

                    @Override
                    public StringBuffer getRequestURL() {
                        StringBuffer url = super.getRequestURL();
                        String str = url.toString();
                        return new StringBuffer(str.replaceAll("/{2,}", "/").replace(":/", "://"));
                    }

                    @Override
                    public String getServletPath() {
                        String servletPath = super.getServletPath();
                        return servletPath != null ? servletPath.replaceAll("/{2,}", "/") : servletPath;
                    }
                };
                chain.doFilter(wrappedRequest, response);
                return;
            }
        }
        chain.doFilter(request, response);
    }
}
