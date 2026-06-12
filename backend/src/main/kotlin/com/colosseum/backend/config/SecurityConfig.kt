package com.colosseum.backend.config

import com.nimbusds.jose.JWSAlgorithm
import com.nimbusds.jose.proc.JWSVerificationKeySelector
import com.nimbusds.jose.proc.SecurityContext
import com.nimbusds.jwt.proc.DefaultJWTProcessor
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder
import org.springframework.security.web.SecurityFilterChain
import com.nimbusds.jose.jwk.source.JWKSourceBuilder
import java.net.URI

@Configuration
@EnableWebSecurity
class SecurityConfig(
    @Value("\${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}") private val jwkSetUri: String,
) {

    @Bean
    fun jwtDecoder(): JwtDecoder {
        val jwkSource = JWKSourceBuilder.create<SecurityContext>(URI(jwkSetUri).toURL()).build()
        val jwtProcessor = DefaultJWTProcessor<SecurityContext>().apply {
            jwsKeySelector = JWSVerificationKeySelector(JWSAlgorithm.ES256, jwkSource)
        }
        return NimbusJwtDecoder(jwtProcessor)
    }

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain = http
        .csrf { it.disable() }
        .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
        .authorizeHttpRequests {
            it.requestMatchers("/api/categories/**", "/api/formulas/**", "/api/universities").permitAll()
            it.requestMatchers("/api/favorites/**").authenticated()
            it.requestMatchers("/api/study-logs/**").authenticated()
            it.anyRequest().permitAll()
        }
        .oauth2ResourceServer { it.jwt {} }
        .build()
}
