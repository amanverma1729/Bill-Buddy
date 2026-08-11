package com.aman.split_with_room_mates.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aman.split_with_room_mates.dto.Rooms;

public interface RoomsRepository extends JpaRepository<Rooms, Integer> {
	Rooms findByRoomName(String roomName);
}
