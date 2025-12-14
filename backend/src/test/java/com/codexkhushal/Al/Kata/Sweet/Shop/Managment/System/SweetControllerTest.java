package com.codexkhushal.Al.Kata.Sweet.Shop.Managment.System;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.hamcrest.Matchers.hasSize;

@SpringBootTest
@AutoConfigureMockMvc
public class SweetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private SweetRepository sweetRepository;

    @BeforeEach
    void setUp() {
        sweetRepository.deleteAll();
    }

    @Test
    public void shouldCreateValidSweet() throws Exception {
        SweetController.SweetRequest request = new SweetController.SweetRequest(
            "Mint Choco", "Candy", 1.50, 50, "http://img.com/mint.jpg"
        );

        mockMvc.perform(post("/api/sweets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    public void shouldRejectNegativePrice() throws Exception {
        SweetController.SweetRequest request = new SweetController.SweetRequest(
            "Bad Sweet", "Candy", -5.00, 10, "http://img.com/bad.jpg"
        );

        mockMvc.perform(post("/api/sweets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void shouldGetAllSweets() throws Exception {
        mockMvc.perform(get("/api/sweets"))
                .andExpect(status().isOk());
    }

    @Test
    public void shouldGetSweetById() throws Exception {
        Sweet savedSweet = sweetRepository.save(new Sweet("Target Sweet", "Candy", 2.50, 20, "img_url"));
        
        mockMvc.perform(get("/api/sweets/" + savedSweet.getId()))
                .andExpect(status().isOk());
    }

    @Test
    public void shouldUpdateSweet() throws Exception {
        Sweet savedSweet = sweetRepository.save(new Sweet("Old Name", "Candy", 1.00, 10, "old_url"));

        SweetController.SweetRequest updateRequest = new SweetController.SweetRequest(
            "New Name", "Candy", 5.00, 20, "new_url"
        );

        mockMvc.perform(put("/api/sweets/" + savedSweet.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk());
    }

    @Test
    public void shouldDeleteSweet() throws Exception {
        Sweet savedSweet = sweetRepository.save(new Sweet("To Delete", "Candy", 1.00, 10, "del_url"));

        mockMvc.perform(delete("/api/sweets/" + savedSweet.getId()))
                .andExpect(status().isNoContent());
    }

    @Test
    public void shouldFindSweetsByCategory() throws Exception {
        sweetRepository.save(new Sweet("Dark Choco", "Chocolate", 2.50, 20, "choco.jpg"));
        sweetRepository.save(new Sweet("Gummy Bear", "Candy", 1.50, 50, "gummy.jpg"));

        mockMvc.perform(get("/api/sweets/category/Chocolate"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value("Dark Choco"));
    }
}