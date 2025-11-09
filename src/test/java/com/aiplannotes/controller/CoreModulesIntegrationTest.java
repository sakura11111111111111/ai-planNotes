package com.aiplannotes.controller;

import com.aiplannotes.dto.*;
import com.aiplannotes.entity.ReviewRecord;
import com.aiplannotes.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CoreModulesIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private ReviewRecordRepository reviewRecordRepository;

    @Autowired
    private AiSummaryRepository aiSummaryRepository;

    private String jwtToken;

    @BeforeEach
    void setUp() throws Exception {
        // Clean up database
        reviewRecordRepository.deleteAll();
        aiSummaryRepository.deleteAll();
        noteRepository.deleteAll();
        categoryRepository.deleteAll();
        userRepository.deleteAll();

        // Register and login a test user
        RegisterRequest registerRequest = new RegisterRequest(
                "testuser",
                "password123",
                "test@example.com"
        );

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated());

        LoginRequest loginRequest = new LoginRequest("testuser", "password123");
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String loginResponse = loginResult.getResponse().getContentAsString();
        jwtToken = objectMapper.readTree(loginResponse).get("data").get("token").asText();
    }

    // ========== Category Tests ==========

    @Test
    void testCreateCategorySuccess() throws Exception {
        CreateCategoryRequest request = new CreateCategoryRequest("考研数学");

        mockMvc.perform(post("/api/categories")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value(201))
                .andExpect(jsonPath("$.message").value("Category created successfully."))
                .andExpect(jsonPath("$.data.name").value("考研数学"))
                .andExpect(jsonPath("$.data.id").exists())
                .andExpect(jsonPath("$.data.createdAt").exists());
    }

    @Test
    void testCreateCategoryDuplicateName() throws Exception {
        CreateCategoryRequest request = new CreateCategoryRequest("考研数学");

        // Create first category
        mockMvc.perform(post("/api/categories")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        // Try to create duplicate
        mockMvc.perform(post("/api/categories")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value(409))
                .andExpect(jsonPath("$.message").value(containsString("already exists")));
    }

    @Test
    void testGetAllCategories() throws Exception {
        // Create two categories
        mockMvc.perform(post("/api/categories")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new CreateCategoryRequest("Category 1"))))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/categories")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new CreateCategoryRequest("Category 2"))))
                .andExpect(status().isCreated());

        // Get all categories
        mockMvc.perform(get("/api/categories")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data", hasSize(2)))
                .andExpect(jsonPath("$.data[0].name").exists())
                .andExpect(jsonPath("$.data[1].name").exists());
    }

    @Test
    void testUpdateCategory() throws Exception {
        // Create category
        MvcResult createResult = mockMvc.perform(post("/api/categories")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new CreateCategoryRequest("Old Name"))))
                .andExpect(status().isCreated())
                .andReturn();

        String responseJson = createResult.getResponse().getContentAsString();
        Long categoryId = objectMapper.readTree(responseJson).get("data").get("id").asLong();

        // Update category
        UpdateCategoryRequest updateRequest = new UpdateCategoryRequest("New Name");
        mockMvc.perform(put("/api/categories/" + categoryId)
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Category updated successfully."))
                .andExpect(jsonPath("$.data.name").value("New Name"));
    }

    @Test
    void testDeleteCategoryWithNotes() throws Exception {
        // Create category and note
        MvcResult createCategoryResult = mockMvc.perform(post("/api/categories")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new CreateCategoryRequest("Test Category"))))
                .andExpect(status().isCreated())
                .andReturn();

        Long categoryId = objectMapper.readTree(createCategoryResult.getResponse().getContentAsString())
                .get("data").get("id").asLong();

        // Create note in this category
        CreateNoteRequest noteRequest = new CreateNoteRequest(
                "Test Note", "Content", categoryId, true, 30
        );
        mockMvc.perform(post("/api/notes")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(noteRequest)))
                .andExpect(status().isCreated());

        // Try to delete category
        mockMvc.perform(delete("/api/categories/" + categoryId)
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value(409))
                .andExpect(jsonPath("$.message").value(containsString("contains notes")));
    }

    @Test
    void testDeleteEmptyCategory() throws Exception {
        // Create category
        MvcResult createResult = mockMvc.perform(post("/api/categories")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new CreateCategoryRequest("Empty Category"))))
                .andExpect(status().isCreated())
                .andReturn();

        Long categoryId = objectMapper.readTree(createResult.getResponse().getContentAsString())
                .get("data").get("id").asLong();

        // Delete category
        mockMvc.perform(delete("/api/categories/" + categoryId)
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isNoContent());
    }

    // ========== Note Tests ==========

    @Test
    void testCreateNoteSuccess() throws Exception {
        // Create category first
        MvcResult categoryResult = mockMvc.perform(post("/api/categories")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new CreateCategoryRequest("Test Category"))))
                .andExpect(status().isCreated())
                .andReturn();

        Long categoryId = objectMapper.readTree(categoryResult.getResponse().getContentAsString())
                .get("data").get("id").asLong();

        // Create note
        CreateNoteRequest noteRequest = new CreateNoteRequest(
                "微积分基本定理",
                "微积分基本定理是连接微分学和积分学的桥梁...",
                categoryId,
                true,
                30
        );

        mockMvc.perform(post("/api/notes")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(noteRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value(201))
                .andExpect(jsonPath("$.message").value("Note created successfully."))
                .andExpect(jsonPath("$.data.title").value("微积分基本定理"))
                .andExpect(jsonPath("$.data.categoryId").value(categoryId))
                .andExpect(jsonPath("$.data.isSupervised").value(true))
                .andExpect(jsonPath("$.data.supervisionDurationSeconds").value(30));
    }

    @Test
    void testGetNoteDetail() throws Exception {
        // Create note
        CreateNoteRequest noteRequest = new CreateNoteRequest(
                "Test Note", "Test Content", null, true, 30
        );
        MvcResult createResult = mockMvc.perform(post("/api/notes")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(noteRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        Long noteId = objectMapper.readTree(createResult.getResponse().getContentAsString())
                .get("data").get("id").asLong();

        // Get note detail
        mockMvc.perform(get("/api/notes/" + noteId)
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(noteId))
                .andExpect(jsonPath("$.data.title").value("Test Note"))
                .andExpect(jsonPath("$.data.content").value("Test Content"))
                .andExpect(jsonPath("$.data.currentReviewRecord").exists())
                .andExpect(jsonPath("$.data.currentReviewRecord.stageNumber").value(1));
    }

    @Test
    void testUpdateNote() throws Exception {
        // Create note
        CreateNoteRequest noteRequest = new CreateNoteRequest(
                "Original Title", "Original Content", null, true, 30
        );
        MvcResult createResult = mockMvc.perform(post("/api/notes")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(noteRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        Long noteId = objectMapper.readTree(createResult.getResponse().getContentAsString())
                .get("data").get("id").asLong();

        // Update note
        UpdateNoteRequest updateRequest = new UpdateNoteRequest(
                "Updated Title", "Updated Content", null, false, 10
        );
        mockMvc.perform(put("/api/notes/" + noteId)
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Note updated successfully."))
                .andExpect(jsonPath("$.data.title").value("Updated Title"))
                .andExpect(jsonPath("$.data.content").value("Updated Content"))
                .andExpect(jsonPath("$.data.isSupervised").value(false));
    }

    @Test
    void testDeleteNote() throws Exception {
        // Create note
        CreateNoteRequest noteRequest = new CreateNoteRequest(
                "Test Note", "Test Content", null, true, 30
        );
        MvcResult createResult = mockMvc.perform(post("/api/notes")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(noteRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        Long noteId = objectMapper.readTree(createResult.getResponse().getContentAsString())
                .get("data").get("id").asLong();

        // Delete note
        mockMvc.perform(delete("/api/notes/" + noteId)
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isNoContent());

        // Verify note is deleted
        mockMvc.perform(get("/api/notes/" + noteId)
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetNotesByCategory() throws Exception {
        // Create category
        MvcResult categoryResult = mockMvc.perform(post("/api/categories")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new CreateCategoryRequest("Test Category"))))
                .andExpect(status().isCreated())
                .andReturn();

        Long categoryId = objectMapper.readTree(categoryResult.getResponse().getContentAsString())
                .get("data").get("id").asLong();

        // Create notes
        CreateNoteRequest note1 = new CreateNoteRequest("Note 1", "Content 1", categoryId, true, 30);
        CreateNoteRequest note2 = new CreateNoteRequest("Note 2", "Content 2", categoryId, false, 10);

        mockMvc.perform(post("/api/notes")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(note1)))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/notes")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(note2)))
                .andExpect(status().isCreated());

        // Get notes by category
        mockMvc.perform(get("/api/notes?categoryId=" + categoryId)
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(2)));
    }

    // ========== Review/Task Tests ==========

    @Test
    void testGetTodayTasks() throws Exception {
        // Create note (which auto-creates first review record)
        CreateNoteRequest noteRequest = new CreateNoteRequest(
                "Test Note", "Test Content", null, true, 30
        );
        mockMvc.perform(post("/api/notes")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(noteRequest)))
                .andExpect(status().isCreated());

        // Get today's tasks
        mockMvc.perform(get("/api/tasks/today")
                .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(1)))
                .andExpect(jsonPath("$.data[0].title").value("Test Note"))
                .andExpect(jsonPath("$.data[0].currentReviewStage").value(1));
    }

    @Test
    void testSubmitReviewRemembered() throws Exception {
        // Create note
        CreateNoteRequest noteRequest = new CreateNoteRequest(
                "Test Note", "Test Content", null, true, 30
        );
        MvcResult createResult = mockMvc.perform(post("/api/notes")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(noteRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        Long noteId = objectMapper.readTree(createResult.getResponse().getContentAsString())
                .get("data").get("id").asLong();

        // Submit review as REMEMBERED
        SubmitReviewRequest reviewRequest = new SubmitReviewRequest(noteId, "REMEMBERED", 35);
        mockMvc.perform(post("/api/reviews/submit")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reviewRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Review result submitted successfully."))
                .andExpect(jsonPath("$.data.nextReviewDate").exists());
    }

    @Test
    void testSubmitReviewForgotten() throws Exception {
        // Create note
        CreateNoteRequest noteRequest = new CreateNoteRequest(
                "Test Note", "Test Content", null, true, 30
        );
        MvcResult createResult = mockMvc.perform(post("/api/notes")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(noteRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        Long noteId = objectMapper.readTree(createResult.getResponse().getContentAsString())
                .get("data").get("id").asLong();

        // Submit review as FORGOTTEN (should reset to stage 1)
        SubmitReviewRequest reviewRequest = new SubmitReviewRequest(noteId, "FORGOTTEN", 20);
        mockMvc.perform(post("/api/reviews/submit")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reviewRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.nextReviewDate").exists());
    }

    // ========== AI Summary Tests ==========

    @Test
    void testGenerateAiSummary() throws Exception {
        // Create note
        CreateNoteRequest noteRequest = new CreateNoteRequest(
                "Test Note",
                "This is a long content that should be summarized by the AI service mock implementation.",
                null,
                true,
                30
        );
        MvcResult createResult = mockMvc.perform(post("/api/notes")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(noteRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        Long noteId = objectMapper.readTree(createResult.getResponse().getContentAsString())
                .get("data").get("id").asLong();

        // Generate AI summary
        GenerateSummaryRequest summaryRequest = new GenerateSummaryRequest(noteId);
        mockMvc.perform(post("/api/ai/summarize")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(summaryRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("AI summary generated successfully."))
                .andExpect(jsonPath("$.data.summaryText").exists())
                .andExpect(jsonPath("$.data.modelUsed").value("mock-v1.0"))
                .andExpect(jsonPath("$.data.createdAt").exists());
    }

    @Test
    void testGenerateAiSummaryForNonExistentNote() throws Exception {
        GenerateSummaryRequest summaryRequest = new GenerateSummaryRequest(99999L);
        mockMvc.perform(post("/api/ai/summarize")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(summaryRequest)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value(404));
    }

    // ========== Authorization Tests ==========

    @Test
    void testUnauthorizedAccessWithoutToken() throws Exception {
        // Spring Security returns 403 for anonymous users trying to access secured endpoints
        mockMvc.perform(get("/api/categories"))
                .andExpect(status().isForbidden());
    }

    @Test
    void testCannotAccessOtherUsersResources() throws Exception {
        // Create a category
        MvcResult categoryResult = mockMvc.perform(post("/api/categories")
                .header("Authorization", "Bearer " + jwtToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new CreateCategoryRequest("My Category"))))
                .andExpect(status().isCreated())
                .andReturn();

        Long categoryId = objectMapper.readTree(categoryResult.getResponse().getContentAsString())
                .get("data").get("id").asLong();

        // Register and login second user
        RegisterRequest register2 = new RegisterRequest("user2", "password123", "user2@example.com");
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(register2)))
                .andExpect(status().isCreated());

        LoginRequest login2 = new LoginRequest("user2", "password123");
        MvcResult loginResult2 = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(login2)))
                .andExpect(status().isOk())
                .andReturn();

        String token2 = objectMapper.readTree(loginResult2.getResponse().getContentAsString())
                .get("data").get("token").asText();

        // Try to update category with second user's token
        UpdateCategoryRequest updateRequest = new UpdateCategoryRequest("Hacked Category");
        mockMvc.perform(put("/api/categories/" + categoryId)
                .header("Authorization", "Bearer " + token2)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isNotFound()); // Should not find the category for this user
    }
}
