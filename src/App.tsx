import {useEffect, useState} from 'react'
import './App.css'

function App() {

    //Definir primero las variables de estados
    const [tiempo, setTiempo] = useState(25 * 60)
    const [funcionando, setfuncionamiento] = useState(false)
    const [modo, setModo] = useState("pomodoro")

    const pedirPermiso = async (): Promise<void> => {
        if (Notification.permission === "default") {
            await Notification.requestPermission();
        }
    };

    // Función para mostrar notificación
    const mostrarNotificacion = (titulo: string, mensaje: string): void => {
        if (Notification.permission === "granted") {
            new Notification(titulo, {
                body: mensaje,
                icon: "🍅"
            });
        }
    };

    //Hook para que se valla restando de uno en uno el numero del reloj
    useEffect(() => {

        //CASO 1
        if (funcionando && tiempo > 0 && modo == "pomodoro") {
            const timer = setTimeout(() => {
                setTiempo(tiempo - 1);
            }, 1000);

            return () => clearTimeout(timer);
        }

        //CASO 2
        else if (funcionando && tiempo == 0 && modo == "pomodoro") {
            setModo("descanso");
            setTiempo(5 * 60);
            mostrarNotificacion("¡Pomodoro completado!", "¡Hora de descansar! 😴");
        }

        //CASO 3
        else if (funcionando && tiempo > 0 && modo == "descanso") {
            const timer = setTimeout(() => {
                setTiempo(tiempo - 1)  // ← Cambiar aquí
            }, 1000);
            return () => clearTimeout(timer);
        }

        //CASO 4
        else if (funcionando && tiempo == 0 && modo == "descanso") {
            setModo("pomodoro");
            setTiempo(25 * 60)
            mostrarNotificacion("¡Descanso terminado!", "¡Vuelve al trabajo! 💪");
        }

    }, [funcionando, tiempo, modo]);

    useEffect(() => {
        pedirPermiso();
    }, []);

    //Funcion para calcular la hora en formato fecha y hora
    function transformar_numero(tiempo: number) {
        const minutos = Math.floor(tiempo / 60)
        const segundos = tiempo % 60
        const minutosFormateados = String(minutos).padStart(2, "0")
        const segundosFormateados = String(segundos).padStart(2, "0")

        return minutosFormateados + ":" + segundosFormateados

    }

    return (

        <div className="flex-col  text-center">
            <h1 className="text-7xl m-9">Pomodoro</h1>
            <h2 className="text-4xl m-9">
                {transformar_numero(tiempo)}</h2>
            <p className="text-xl">Pomodoro es un metodo de estudia que consiste en estudiar 25 minutos concentrado y pasar a 5 minutos de descanso</p>

            <div className="flex justify-center gap-4 m-5">
                {/*Boton para prender el tiempo*/}
                <button onClick={() => {
                    setfuncionamiento(true)
                }}
                className="bg-green-600 text-3xl">Empezar
                </button>

                {/*Boton para apagar el temporizador*/}
                <button onClick={() => {
                    setfuncionamiento(false)
                }}
                className="bg-amber-400 text-3xl">Pausar
                </button>

                {/*Boton para reiniciar temporizador*/}
                <button onClick={() => {
                    setTiempo(25 * 60)
                    setfuncionamiento(false)
                }}
                className="bg-red-500 text-3xl">Reiniciar
                </button>
                <button>y el pic</button>
            </div>

        </div>

    )

}

export default App