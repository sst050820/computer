package main

import (
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestGetABECiphertext_ReturnsCiphertext(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/api/encrypt" {
			t.Fatalf("unexpected path: %s", r.URL.Path)
		}
		body, _ := io.ReadAll(r.Body)
		if string(body) != "apple" {
			t.Fatalf("unexpected request body: %s", string(body))
		}
		w.Write([]byte("CIPHER_TEXT_123"))
	}))
	defer server.Close()

	opath := os.Getenv("ABE_SERVICE_URL")
	os.Setenv("ABE_SERVICE_URL", server.URL+"/api/encrypt")
	defer func() {
		if opath == "" {
			os.Unsetenv("ABE_SERVICE_URL")
		} else {
			os.Setenv("ABE_SERVICE_URL", opath)
		}
	}()

	cipher := getABECiphertext("apple")
	if cipher != "CIPHER_TEXT_123" {
		t.Fatalf("expected cipher text, got %q", cipher)
	}
}

func TestGetABECiphertext_ReturnsErrorMarkerOnFailure(t *testing.T) {
	os.Setenv("ABE_SERVICE_URL", "http://127.0.0.1:0/api/encrypt")
	cipher := getABECiphertext("apple")
	if cipher != "ERROR_ENCRYPT_FAILED" {
		t.Fatalf("expected error marker, got %q", cipher)
	}
}

func TestCreateFruitEndpoint_InvalidPayload(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := newRouter()

	req := httptest.NewRequest("POST", "/api/createFruit", strings.NewReader(`{invalid-json}`))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 for invalid JSON, got %d", w.Code)
	}
}
