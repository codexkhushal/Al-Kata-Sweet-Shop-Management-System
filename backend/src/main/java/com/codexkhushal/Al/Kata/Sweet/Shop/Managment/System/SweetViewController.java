package com.codexkhushal.Al.Kata.Sweet.Shop.Managment.System;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller 
@RequestMapping("/")
public class SweetViewController {

    private final SweetRepository sweetRepository;

    public SweetViewController(SweetRepository sweetRepository) {
        this.sweetRepository = sweetRepository;
    }

    @GetMapping
    public String home(Model model) {
        var sweets = sweetRepository.findAll();
        
        model.addAttribute("sweets", sweets);
        
        return "home";
    }
}