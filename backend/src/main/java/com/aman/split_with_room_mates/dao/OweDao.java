package com.aman.split_with_room_mates.dao;

import com.aman.split_with_room_mates.dto.Owe;

public interface OweDao {

	Owe findByUserIdDao(int userId);
}
