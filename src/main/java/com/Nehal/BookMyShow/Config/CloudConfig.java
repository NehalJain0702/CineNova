package com.Nehal.BookMyShow.Config;

import com.Nehal.BookMyShow.Services.CloudinaryService;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Configuration
public class CloudConfig {

    @Bean
    public Cloudinary cloudinary() {

        return new Cloudinary(
                ObjectUtils.asMap(
                        "cloud_name", System.getenv("CLOUDINARY_CLOUD_NAME"),
                        "api_key", System.getenv("CLOUDINARY_API_KEY"),
                        "api_secret", System.getenv("CLOUDINARY_API_SECRET")
                )
        );
    }

}