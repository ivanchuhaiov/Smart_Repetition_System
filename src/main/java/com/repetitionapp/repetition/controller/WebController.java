package com.repetitionapp.repetition.controller;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@AllArgsConstructor
public class WebController {
    @GetMapping("/web")
    public String web() {
        return "index";
    }
}
