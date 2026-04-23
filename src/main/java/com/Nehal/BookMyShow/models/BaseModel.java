package com.Nehal.BookMyShow.models;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;

@MappedSuperclass
public class BaseModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @CreationTimestamp
    private Date createdAt;
    @UpdateTimestamp// ✅ naming fix
    private Date modifiedAt;

    public Integer getId() {   // ✅ FIX
        return id;
    }

    public void setId(Integer id) {   // ✅ FIX
        this.id = id;
    }
}