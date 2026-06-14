package mth.controller;

import mth.models.Users;
import mth.services.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*")
public class UsersController {

    @Autowired
    private UsersService usersService;

    @PostMapping("/signup")
    public Map<String, Object> signup(@RequestBody Users user) {
        return usersService.signup(user);
    }

    @PostMapping("/signin")
    public Map<String, Object> signin(@RequestBody Map<String, String> body) {
        return usersService.signin(body.get("username"), body.get("password"));
    }

    @GetMapping("/uinfo")
    public Map<String, Object> getUserInfo(@RequestHeader("Token") String token) {
        return usersService.getUserInfo(token);
    }

    @GetMapping("/profile")
    public Map<String, Object> getProfile(@RequestHeader("Token") String token) {
        return usersService.getProfile(token);
    }

    @GetMapping("/getallusers/{page}/{size}")
    public Map<String, Object> getAllUsers(
            @PathVariable int page,
            @PathVariable int size,
            @RequestHeader("Token") String token) {
        return usersService.getAllUsers(page, size, token);
    }

    @GetMapping("/getuser/{id}")
    public Map<String, Object> getUser(@PathVariable Long id) {
        return usersService.getUser(id);
    }

    @PostMapping("/saveuser")
    public Map<String, Object> saveUser(@RequestBody Users user) {
        return usersService.saveUser(user);
    }

    @PutMapping("/updateuser/{id}")
    public Map<String, Object> updateUser(@PathVariable Long id, @RequestBody Users user) {
        return usersService.updateUser(id, user);
    }

    @DeleteMapping("/deleteuser/{id}")
    public Map<String, Object> deleteUser(@PathVariable Long id) {
        return usersService.deleteUser(id);
    }

    @GetMapping("/searchuser/{key}")
    public Map<String, Object> searchUser(@PathVariable String key) {
        return usersService.searchUser(key);
    }
}
