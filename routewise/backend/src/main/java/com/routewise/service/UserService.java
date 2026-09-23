package com.routewise.service;

import com.routewise.dto.user.UpdateUserRequest;
import com.routewise.dto.user.UserResponse;
import com.routewise.entity.User;
import com.routewise.exception.ResourceNotFoundException;
import com.routewise.mapper.UserMapper;
import com.routewise.repository.UserRepository;
import com.routewise.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser() {
        return userMapper.toResponse(loadCurrentUser());
    }

    @Transactional
    public UserResponse updateCurrentUser(UpdateUserRequest request) {
        User user = loadCurrentUser();
        user.setFullName(request.fullName().trim());
        if (request.distanceUnit() != null) {
            user.setDistanceUnit(request.distanceUnit());
        }
        if (request.timeFormat() != null) {
            user.setTimeFormat(request.timeFormat());
        }
        return userMapper.toResponse(userRepository.save(user));
    }

    private User loadCurrentUser() {
        return userRepository.findById(SecurityUtils.getCurrentUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
