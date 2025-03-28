package main

import (
	"fmt"
	"net/http"
	"os"
	"syncopate/configs"
	"syncopate/routes"
	"syncopate/socket"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Pas dit aan voor productie om restricties op te leggen
	},
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Error upgrading connection:", err)
		return
	}
	defer conn.Close()

	fmt.Println("Client connected")

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("Error reading message:", err)
			break
		}
		fmt.Printf("Received: %s\n", msg)

		// Echo het bericht terug
		err = conn.WriteMessage(websocket.TextMessage, msg)
		if err != nil {
			fmt.Println("Error writing message:", err)
			break
		}
	}
}

func main() {

	// err := godotenv.Load()
	// if err != nil {
	// 	fmt.Println("Geen .env bestand gevonden, gebruik standaardinstellingen")
	// }

	e := echo.New()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000", "https://127.0.0.1:3000", "https://afstudeerproject-nicolas-ghs.vercel.app"},
		AllowMethods: []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete},
		AllowHeaders: []string{"Content-Type", "Authorization"},
	}))

	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})

	// run db
	configs.ConnectDB()

	// routes
	routes.UserRoute(e)
	routes.TrackRoute(e)
	routes.InstrumentRoute(e)
	routes.AudioTrackRoute(e)
	// routes.SetupRoutes(e)

	e.GET("/ws", func(c echo.Context) error {
		handleConnections(c.Response(), c.Request())
		return nil
	})

	e.GET("/ws/:userId", func(c echo.Context) error {
		userId := c.Param("userId")
		conn, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
		if err != nil {
			fmt.Println("Error upgrading WebSocket:", err)
			return err
		}
		defer conn.Close()

		// Registreer gebruiker
		socket.RegisterUser(userId, conn)

		for {
			_, _, err := conn.ReadMessage()
			if err != nil {
				fmt.Println("User disconnected:", userId)
				socket.UnregisterUser(userId)
				break
			}
		}
		return nil
	})

	e.Logger.Fatal(e.Start(":" + port))
}
