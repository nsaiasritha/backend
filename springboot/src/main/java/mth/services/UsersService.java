package mth.services;

import mth.models.Menus;
import mth.models.Users;
import mth.repository.MenusRepository;
import mth.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UsersService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private MenusRepository menusRepository;

    @Autowired
    private JwtService jwtService;

    public Map<String, Object> signup(Users user) {
        Map<String, Object> res = new HashMap<>();
        try {
            Optional<Users> existing = usersRepository.findByEmail(user.getEmail());
            if (existing.isPresent()) {
                res.put("code", 409);
                res.put("message", "Email already exists");
                return res;
            }
            user.setRole(1);
            user.setStatus(1);
            usersRepository.save(user);
            res.put("code", 200);
            res.put("message", "Signup successful");
        } catch (Exception e) {
            res.put("code", 500);
            res.put("message", e.getMessage());
        }
        return res;
    }

    public Map<String, Object> signin(String email, String password) {
        Map<String, Object> res = new HashMap<>();
        try {
            Optional<Users> userOpt = usersRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                res.put("code", 404);
                res.put("message", "User not found");
                return res;
            }
            Users user = userOpt.get();
            if (!user.getPassword().equals(password)) {
                res.put("code", 401);
                res.put("message", "Invalid password");
                return res;
            }
            if (user.getStatus() == 0) {
                res.put("code", 403);
                res.put("message", "Account is inactive");
                return res;
            }
            String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole());
            res.put("code", 200);
            res.put("jwt", token);
        } catch (Exception e) {
            res.put("code", 500);
            res.put("message", e.getMessage());
        }
        return res;
    }

    public Map<String, Object> getUserInfo(String token) {
        Map<String, Object> res = new HashMap<>();
        try {
            Long userId = jwtService.getUserIdFromToken(token);
            Integer role = jwtService.getRoleFromToken(token);
            Optional<Users> userOpt = usersRepository.findById(userId);
            if (userOpt.isEmpty()) {
                res.put("code", 404);
                res.put("message", "User not found");
                return res;
            }
            Users user = userOpt.get();
            List<Menus> menus = menusRepository.findMenusByRole(Long.valueOf(role));
            res.put("code", 200);
            res.put("fullname", user.getFullname());
            res.put("menulist", menus);
        } catch (Exception e) {
            res.put("code", 500);
            res.put("message", e.getMessage());
        }
        return res;
    }

    public Map<String, Object> getProfile(String token) {
        Map<String, Object> res = new HashMap<>();
        try {
            Long userId = jwtService.getUserIdFromToken(token);
            Optional<Users> userOpt = usersRepository.findById(userId);
            if (userOpt.isEmpty()) {
                res.put("code", 404);
                res.put("message", "User not found");
                return res;
            }
            Users user = userOpt.get();
            res.put("code", 200);
            res.put("id", user.getId());
            res.put("fullname", user.getFullname());
            res.put("phone", user.getPhone());
            res.put("email", user.getEmail());
            res.put("role", user.getRole());
        } catch (Exception e) {
            res.put("code", 500);
            res.put("message", e.getMessage());
        }
        return res;
    }

    public Map<String, Object> getAllUsers(int page, int size, String token) {
        Map<String, Object> res = new HashMap<>();
        try {
            Page<Users> usersPage = usersRepository.findAll(PageRequest.of(page - 1, size));
            res.put("code", 200);
            res.put("users", usersPage.getContent());
            res.put("total", usersPage.getTotalElements());
        } catch (Exception e) {
            res.put("code", 500);
            res.put("message", e.getMessage());
        }
        return res;
    }

    public Map<String, Object> searchUser(String key) {
        Map<String, Object> res = new HashMap<>();
        try {
            List<Users> users = usersRepository.searchUsers(key);
            res.put("code", 200);
            res.put("users", users);
        } catch (Exception e) {
            res.put("code", 500);
            res.put("message", e.getMessage());
        }
        return res;
    }

    public Map<String, Object> saveUser(Users user) {
        Map<String, Object> res = new HashMap<>();
        try {
            if (user.getRole() == null) user.setRole(1);
            if (user.getStatus() == null) user.setStatus(1);
            usersRepository.save(user);
            res.put("code", 200);
            res.put("message", "User saved successfully");
        } catch (Exception e) {
            res.put("code", 500);
            res.put("message", e.getMessage());
        }
        return res;
    }

    public Map<String, Object> updateUser(Long id, Users user) {
        Map<String, Object> res = new HashMap<>();
        try {
            Optional<Users> existing = usersRepository.findById(id);
            if (existing.isEmpty()) {
                res.put("code", 404);
                res.put("message", "User not found");
                return res;
            }
            Users u = existing.get();
            u.setFullname(user.getFullname());
            u.setPhone(user.getPhone());
            u.setEmail(user.getEmail());
            if (user.getPassword() != null && !user.getPassword().isEmpty()) {
                u.setPassword(user.getPassword());
            }
            u.setRole(user.getRole());
            u.setStatus(user.getStatus());
            usersRepository.save(u);
            res.put("code", 200);
            res.put("message", "User updated successfully");
        } catch (Exception e) {
            res.put("code", 500);
            res.put("message", e.getMessage());
        }
        return res;
    }

    public Map<String, Object> deleteUser(Long id) {
        Map<String, Object> res = new HashMap<>();
        try {
            usersRepository.deleteById(id);
            res.put("code", 200);
            res.put("message", "User deleted successfully");
        } catch (Exception e) {
            res.put("code", 500);
            res.put("message", e.getMessage());
        }
        return res;
    }

    public Map<String, Object> getUser(Long id) {
        Map<String, Object> res = new HashMap<>();
        try {
            Optional<Users> userOpt = usersRepository.findById(id);
            if (userOpt.isEmpty()) {
                res.put("code", 404);
                res.put("message", "User not found");
                return res;
            }
            res.put("code", 200);
            res.put("user", userOpt.get());
        } catch (Exception e) {
            res.put("code", 500);
            res.put("message", e.getMessage());
        }
        return res;
    }
}
