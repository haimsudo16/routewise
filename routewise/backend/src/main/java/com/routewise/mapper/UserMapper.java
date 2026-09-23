package com.routewise.mapper;

import com.routewise.dto.user.UserResponse;
import com.routewise.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getDistanceUnit(),
                user.getTimeFormat(),
                user.getCreatedAt()
        );
    }
}
