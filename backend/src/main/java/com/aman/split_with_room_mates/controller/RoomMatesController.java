package com.aman.split_with_room_mates.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aman.split_with_room_mates.dao.RoomDao;
import com.aman.split_with_room_mates.dao.RoomMatesDao;
import com.aman.split_with_room_mates.dao.UserDao;
import com.aman.split_with_room_mates.dto.Rooms;
import com.aman.split_with_room_mates.dto.User;
import com.aman.split_with_room_mates.repository.RoomMatesRepository;

import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping(value = "/roomMates")
@AllArgsConstructor
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class RoomMatesController {

	private RoomMatesDao matesDao;

	private RoomDao roomDao;

	private HttpSession httpSession;

	private UserDao dao;

	private RoomMatesRepository matesRepository;

	@PostMapping(value = "/createRoom")
	public ResponseEntity<?> createRoomController(@RequestBody Rooms rooms) {

		String email = (String) httpSession.getAttribute("userSession");

		if (email == null) {

			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("error", "Authentication required first login with your credentials"));

		}
		User user = dao.findByEmailDao(email);

		if (user == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "user not found"));
		}

		rooms.setUsers(List.of(user));

		Rooms room = matesDao.saveRoomMatesDao(rooms);
		
		user.setRooms(rooms);
		/**
		 * it will update the room id in user table
		 */
		dao.saveUserDao(user);

		return ResponseEntity.status(HttpStatus.CREATED)
				.body(Map.of("message", "Room Created", "roomId", room.getId()));

	}

	@GetMapping(value = "/getAllRoomDetails")
	public List<Rooms> saveRoomMatesController() {
		System.out.println("getUserRooms API called");

		String email = (String) httpSession.getAttribute("userSession");
		if (email == null) {
			return List.of();
		}
		
		User loggedInUser = dao.findByEmailDao(email);
		if (loggedInUser == null) {
			return List.of();
		}

		// Fetch all rooms where the user is a member
		List<Rooms> userRooms = roomDao.findRoomsByUserId(loggedInUser.getId());

		System.out.println(userRooms);
		return userRooms;
	}

	@GetMapping(value = "/addRoomMates/{userEmail}/{roomName}")
	public ResponseEntity<?> addRoomMatesController(@PathVariable(name = "userEmail") String userEmail,
			@PathVariable(name = "roomName") String roomName) {

		String email = (String) httpSession.getAttribute("userSession");

		User user = dao.findByEmailDao(userEmail);

		if (email == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("error", "Authentication required first login with your credentials"));
		}

		if (user == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(Map.of("message", "user not found", "userEmail", userEmail));
		}

		
		Rooms rooms = matesRepository.findByroomName(roomName);
		/**
		 * we are setting rooms id in user
		 */
		user.setRooms(rooms);
		
		/**
		 * this will update the room in user table
		 */
		dao.saveUserDao(user);

		return ResponseEntity.status(HttpStatus.CREATED)
				.body(Map.of("message", "user added in group", "userEmail", userEmail));
	}
}
