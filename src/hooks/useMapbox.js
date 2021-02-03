import { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl';
import { v4 as uuidv4} from 'uuid';
import { Subject } from "rxjs";

mapboxgl.accessToken = 'pk.eyJ1IjoiY3Jpc3RpYW5zZXAiLCJhIjoiY2trcHVpN29mMDNwdDJuazVmdTdvOWJscCJ9.kEcT18-0bGJBOINtJhXGHg';

export const useMapbox = (puntoInicial) => {

    const mapaDiv = useRef();
    const setRef = useCallback((node) => {
        mapaDiv.current = node;
    },[]);


    // referencia a los marcadores
    const marcadores = useRef({});

    // observables de rxjs
    const movimientoMarcador = useRef((new Subject()));
    const nuevoMarcador = useRef((new Subject()));




    // mapa y cords
    const mapa = useRef();
    const [coords, setCoords] = useState(puntoInicial);



    // función para agregar marcadores
    const agregarMarcador = useCallback((e) => {

        const {lng, lat} = e.lngLat;
        const marker = new mapboxgl.Marker();
        marker.id = uuidv4(); // TODO: si el marcador ya tiene ID 
        marker
            .setLngLat([lng, lat])
            .addTo(mapa.current)
            .setDraggable(true)

            marcadores.current[marker.id] = marker;

            nuevoMarcador.current.next({
                id: marker.id,
                lng,lat
            });

            // escuchar marcaddor
            marker.on('drag', ({target}) => {
                const {id} = target;
                const {lng, lat} = target.getLngLat();
                movimientoMarcador.current.next({id,lng,lat});
            });
    },[])


    useEffect(() => {

        const map = new mapboxgl.Map({
            container: mapaDiv.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [puntoInicial.lng, puntoInicial.lat],
            zoom: puntoInicial.zoom
        });

        mapa.current = map;
    
    }, [puntoInicial]);


    // cuando se mueve el mapa
    useEffect(() => {

        mapa.current?.on('move', () => {
            const {lng,lat} = mapa.current.getCenter();
            setCoords({
                lng: lng.toFixed(4),
                lat: lat.toFixed(4),
                zoom: mapa.current.getZoom().toFixed(2)
            })
        });
     
    }, []);


    // agregar marcador al hacer click
    useEffect(() => {

        mapa.current?.on('click', agregarMarcador);
      
    }, [agregarMarcador])





    return {
        coords,
        setRef,
        marcadores,
        agregarMarcador,
        nuevoMarcador$: nuevoMarcador.current,
        movimientoMarcador$: movimientoMarcador.current
    }
}
