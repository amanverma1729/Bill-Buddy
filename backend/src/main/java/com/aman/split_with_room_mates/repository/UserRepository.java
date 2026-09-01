package com.aman.split_with_room_mates.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aman.split_with_room_mates.dto.User;

public interface UserRepository extends JpaRepository<User, Integer> {

	Optional<User> findByEmail(String userEmail);
	
	Optional<User> findFirstByEmail(String userEmail);
	
}
