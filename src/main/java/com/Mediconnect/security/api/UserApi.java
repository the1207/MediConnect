import com.Mediconnect.security.dto.HistoryReponse;
import com.Mediconnect.security.dto.UserDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

import java.util.List;
import java.util.UUID;

@PostMapping("/login")
public ResponseEntity<AuthenticationResponse> authenticateUser(@RequestBody @Valid LoginDTO loginDTO) {
    return ResponseEntity.ok(userService.authenticate(loginDTO));
}

@GetMapping("/role")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<List<RoleDTO>> getAllRole() {
    return ResponseEntity.ok(userService.getAllRoles());
}

@PostMapping("/users")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<UserDTO> saveUsers(@RequestBody UserDTO userDTO) {
    return new ResponseEntity<>(userService.saveUser(userDTO), HttpStatus.CREATED);
}

@GetMapping("/users")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<List<UserRoleReponse>> getAllUser() {
    return ResponseEntity.ok(userService.getAllUsers());
}

@GetMapping("/users/{id}")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<UserRoleReponse> getUserById(@PathVariable("id") Long id) {
    return ResponseEntity.ok(userService.getUserById(id));
}

@PutMapping("/users/{id}")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<UserDTO> updateUsers(@RequestBody UserDTO userDTO, @PathVariable("id") UUID id) {
    return ResponseEntity.ok(userService.updateUser(userDTO, id));
}

@PutMapping("/users/change_password/{id}")
@PreAuthorize("hasAnyRole('ADMIN','MEDECIN','INFIRMIER')")
public ResponseEntity<UserDTO> updatePassword(@PathVariable("id") UUID id, @RequestBody PasswordDTO passwordDTO) {
    return ResponseEntity.ok(userService.updatePassword(id, passwordDTO));
}

@GetMapping("/history")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<List<HistoryReponse>> getAllHistory() {
    return ResponseEntity.ok(userService.getAllHistory());
}

@DeleteMapping("/users/{id}")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<Void> deleteUserById(@PathVariable("id") UUID id) {
    this.userService.deleteUserById(id);
    return ResponseEntity.status(204).build();
}

@GetMapping("/user-enable-true/{id}")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<Void> enableUserById(@PathVariable("id") UUID id) {
    this.userService.enableUserById(id);
    return ResponseEntity.status(204).build();
}