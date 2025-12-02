import cv2
import time
from ultralytics import YOLO

# Import biblioteki Picamera2
from picamera2 import Picamera2

# 1. Ładowanie modelu YOLO
print("Ładowanie modelu YOLO...")
model = YOLO('yolov8n.pt')

def uruchom_picamera2(nazwa_okna="YOLOv8 Picamera2"):
    print("Inicjalizacja Picamera2...")

    # 2. Utworzenie instancji kamery
    picam2 = Picamera2()

    # 3. Konfiguracja wideo
    # Ustawiamy rozdzielczość 640x480 (dla szybkości YOLO)
    # Format 'BGR888' jest kluczowy - OpenCV używa BGR, a nie RGB!
    config = picam2.create_video_configuration(
        main={"size": (640, 480), "format": "BGR888"}
    )
    picam2.configure(config)

    # 4. Uruchomienie kamery
    picam2.start()
    print("Kamera działa. Naciśnij 'q', aby wyjść.")

    # Czas na rozgrzanie (auto-focus, balans bieli)
    time.sleep(2)

    try:
        while True:
            # 5. Pobranie klatki jako macierzy NumPy
            # capture_array() czeka na nową klatkę i zwraca ją gotową do obróbki
            frame = picam2.capture_array()

            # --- Detekcja YOLO ---
            results = model(frame, verbose=False)
            
            # Rysowanie wyników
            annotated_frame = results[0].plot()

            # --- Wyświetlanie ---
            cv2.imshow(nazwa_okna, annotated_frame)

            # Wyjście z pętli pod 'q'
            if cv2.waitKey(1) == ord('q'):
                break

    except Exception as e:
        print(f"Wystąpił błąd: {e}")

    finally:
        # 6. Sprzątanie
        picam2.stop()
        # picam2.close() # W starszych wersjach wymagane, w nowszych stop() wystarczy
        cv2.destroyAllWindows()
        print("Kamera wyłączona.")

if __name__ == "__main__":
    uruchom_picamera2()