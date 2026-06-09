package com.Nehal.BookMyShow.controllers;

import com.Nehal.BookMyShow.Services.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public class CloudController {
    @Autowired
    private CloudinaryService cloudinaryService;

    @PostMapping("/upload")
    public String upload(@RequestParam("file") MultipartFile file)
            throws IOException {

        return cloudinaryService.uploadImage(file);
    }
}
