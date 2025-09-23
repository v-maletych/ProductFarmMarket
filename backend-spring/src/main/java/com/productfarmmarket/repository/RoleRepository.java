package com.productfarmmarket.repository;

import com.productfarmmarket.model.Role;
import org.springframework.data.jpa.repository.support.JpaRepositoryImplementation;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepositoryImplementation<Role, Integer> {
}
