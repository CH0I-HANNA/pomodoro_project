package com.focusgrove.ossproject.config.jwt;

import com.focusgrove.ossproject.auth.service.CustomUserDetailsService;
import io.jsonwebtoken.ExpiredJwtException; // ExpiredJwtException 임포트
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);

        // JWT 파싱 및 인증 로직을 try-catch 블록으로 감싸 예외 처리
        try {
            userEmail = jwtTokenProvider.extractUsername(jwt);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                // Note: validateToken 내부에서도 만료 검증이 이루어지지만,
                // extractUsername 호출 시 이미 ExpiredJwtException이 발생했으므로
                // 이 로직은 주로 서명(signature) 유효성 검증을 담당합니다.
                if (jwtTokenProvider.validateToken(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (ExpiredJwtException e) {
            // 🚨 토큰 만료 예외 처리 로직 (가장 중요)
            System.err.println("JWT Token Expired: " + e.getMessage());

            // 클라이언트에게 HTTP 401 Unauthorized 응답 반환
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");

            // JSON 응답 본문 작성
            response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"JWT token expired. Please re-login.\"}");

            return; // 필터 체인 진행 중단

        } catch (Exception e) {
            // 🚫 기타 JWT 관련 예외 (서명 오류, 형식 오류 등) 처리
            System.err.println("JWT Validation Error: " + e.getMessage());

            // 403 Forbidden 또는 401 Unauthorized 반환 가능
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Forbidden\", \"message\": \"Invalid JWT token or authentication failure.\"}");

            return;
        }

        filterChain.doFilter(request, response);
    }
}