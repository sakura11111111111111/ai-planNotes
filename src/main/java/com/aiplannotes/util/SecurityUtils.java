package com.aiplannotes.util;

import com.aiplannotes.exception.BusinessException;
import com.aiplannotes.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {
    
    private static UserRepository userRepository;
    
    @Autowired
    public SecurityUtils(UserRepository userRepository) {
        SecurityUtils.userRepository = userRepository;
    }
    
    /**
     * Get the current authenticated user's ID from the JWT token
     * @return the user ID
     * @throws BusinessException if user is not authenticated
     */
    public static Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new BusinessException(401, "Unauthorized");
        }
        
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException(401, "Unauthorized"))
                .getId();
    }
}
