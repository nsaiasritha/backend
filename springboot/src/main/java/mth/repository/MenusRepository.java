package mth.repository;

import mth.models.Menus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MenusRepository extends JpaRepository<Menus, Long> {

    @Query("SELECT m FROM Menus m WHERE m.mid IN (SELECT rm.mid FROM Rolesmapping rm WHERE rm.role = :role)")
    List<Menus> findMenusByRole(@Param("role") Long role);
}
