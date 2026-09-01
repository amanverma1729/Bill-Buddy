package com.aman.split_with_room_mates.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aman.split_with_room_mates.dao.UserDao;
import com.aman.split_with_room_mates.dto.Items;
import com.aman.split_with_room_mates.dto.User;

import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;

@RestController
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
@RequestMapping(value = "/user")
@AllArgsConstructor
public class UserController {

	private UserDao userDao;

	private HttpSession httpSession;

	/**
	 * this api is use for user registration
	 * 
	 * @param user
	 * @return
	 */
	@PostMapping(value = "/saveUser")
	public ResponseEntity<?> saveUserController(@RequestBody User user) {
		try {
			if (user == null || user.getEmail() == null || user.getEmail().trim().isEmpty()) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST)
						.body(Map.of("message", "Email address is required"));
			}

			if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST)
						.body(Map.of("message", "Password is required"));
			}

			String cleanEmail = user.getEmail().trim().toLowerCase();
			user.setEmail(cleanEmail);
			if (user.getName() != null) {
				user.setName(user.getName().trim());
			}

			// Check if user account with this email already exists
			User existingUser = userDao.findByEmailDao(cleanEmail);
			if (existingUser != null) {
				return ResponseEntity.status(HttpStatus.CONFLICT)
						.body(Map.of("message", "An account with this email already exists"));
			}

			user.setId(null);
			User savedUser = userDao.saveUserDao(user);
			return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
					"message", "Account created successfully",
					"id", savedUser.getId(),
					"email", savedUser.getEmail(),
					"name", savedUser.getName() != null ? savedUser.getName() : ""
			));
		} catch (Exception e) {
			System.err.println("Error saving user: " + e.getMessage());
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("message", "Server error while saving user: " + e.getMessage()));
		}
	}

	@GetMapping(value = "/loginUser/{userEmail}/{userPass}")
	public ResponseEntity<?> loginWithUserController(@PathVariable(name = "userEmail") String userEmail,
			@PathVariable(name = "userPass") String userPass) {

		System.out.println("login user !!!");
		if (userEmail == null || userPass == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid Credentials"));
		}

		User user = userDao.findByEmailDao(userEmail.trim().toLowerCase());

		if (user != null && user.getPassword() != null && user.getPassword().equals(userPass)) {

			httpSession.setAttribute("userSession", user.getEmail());

			return ResponseEntity.ok(Map.of("message", "Login Success", "userEmail", user.getEmail()));
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid Credentials"));
	}

	@PostMapping(value = "/loginUser")
	public ResponseEntity<?> loginWithUserPostController(@RequestBody Map<String, String> loginRequest) {
		String userEmail = loginRequest != null ? loginRequest.get("email") : null;
		String userPass = loginRequest != null ? loginRequest.get("password") : null;

		System.out.println("login user POST !!! " + userEmail);

		if (userEmail != null && userPass != null) {
			User user = userDao.findByEmailDao(userEmail.trim().toLowerCase());
			if (user != null && user.getPassword() != null && user.getPassword().equals(userPass)) {
				httpSession.setAttribute("userSession", user.getEmail());
				return ResponseEntity.ok(Map.of("message", "Login Success", "userEmail", user.getEmail()));
			}
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid Credentials"));
	}

	@GetMapping(value = "/userLogout")
	public ResponseEntity<?> userLogout() {

		System.out.println("logout user !!!");

		String email = (String) httpSession.getAttribute("userSession");

		if (email != null) {
			httpSession.invalidate();
			return ResponseEntity.ok(Map.of("message", " Logout Success ", "userEmail", email));
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("user already logout");
	}

	@GetMapping(value = "/getUserLoggedInAddedItemsSummation")
	public ResponseEntity<?> getUserLoggedInAddedItemsSummation(){
		String email = (String) httpSession.getAttribute("userSession");
		if(email!=null) {
			User user = userDao.findByEmailDao(email);
			if(user!=null) {
				Double totalSum=user.getItems().stream().mapToDouble(Items::getPrice).sum();
				return ResponseEntity.ok(Map.of("totalSum",totalSum));
			}else {
				return ResponseEntity.ok(Map.of("message","user not found because sesssion is not working please login then try"));
			}
		}
		return ResponseEntity.ok(Map.of("message","user not found because sesssion is not working please login then try"));
	}
	
	@GetMapping(value = "/getUserName")
	public User getUserNameController(){
		String email = (String) httpSession.getAttribute("userSession");
		if(email!=null) {
			User user = userDao.findByEmailDao(email);
			
			return user;
		}
		return null;
	}
}
