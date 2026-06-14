package mth.models;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "rolesmapping")
@IdClass(RolesmappingId.class)
public class Rolesmapping {

    @Id
    private Long role;

    @Id
    private Long mid;

    public Long getRole() { return role; }
    public void setRole(Long role) { this.role = role; }

    public Long getMid() { return mid; }
    public void setMid(Long mid) { this.mid = mid; }
}

class RolesmappingId implements Serializable {
    private Long role;
    private Long mid;

    public Long getRole() { return role; }
    public void setRole(Long role) { this.role = role; }

    public Long getMid() { return mid; }
    public void setMid(Long mid) { this.mid = mid; }
}
