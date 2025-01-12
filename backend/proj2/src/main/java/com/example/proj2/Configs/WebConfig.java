package com.example.proj2.Configs;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.AsyncSupportConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("18.221.145.66:8080", "http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE","PATCH")
                .allowedHeaders("*").allowCredentials(true);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Exclude your REST endpoints from static resource handling
        registry.addResourceHandler("/static/**", "/public/**", "/resources/**")
                .addResourceLocations("classpath:/static/", "classpath:/public/", "classpath:/resources/");
        // You can add custom handling for other resources, if needed.
    }

    // @Bean
    // public CorsFilter corsFilter(){
    //     CorsConfiguration configuration = new CorsConfiguration();
    //     configuration.addAllowedOrigin("http://localhost:3000");
    //     configuration.addAllowedMethod("*");
    //     configuration.addAllowedHeader("*");
    //     configuration.setAllowCredentials(true);

    //     UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    //     source.registerCorsConfiguration("/**", configuration);

    //     return new CorsFilter(source);

    // }
}
