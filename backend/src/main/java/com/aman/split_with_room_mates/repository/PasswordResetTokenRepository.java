package com.aman.split_with_room_mates.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aman.split_with_room_mates.dto.PasswordResetToken;
import com.aman.split_with_room_mates.dto.User;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByTokenHash(String tokenHash);

    @Modifying
    @Query("DELETE FROM PasswordResetToken prt WHERE prt.user = :user")
    void deleteByUser(@Param("user") User user);
}
