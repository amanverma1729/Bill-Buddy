package com.aman.split_with_room_mates.dao;

import com.aman.split_with_room_mates.dto.User;

public interface UserDao {

	public User saveUserDao(User user);
	
	public User findByEmailDao(String userEmail);
	
	public User findByUserIdDao(int userId);
	
}
