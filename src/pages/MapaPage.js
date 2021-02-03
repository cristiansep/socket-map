import React, { useEffect } from 'react';
import { useMapbox } from '../hooks/useMapbox';






const puntoInicial = {
    lng: -73.1399,
    lat: -40.5793,
    zoom: 13.5
}

export const MapaPage = () => {


    const {setRef, coords, nuevoMarcador$, movimientoMarcador$} = useMapbox(puntoInicial); 


    useEffect(() => {

        nuevoMarcador$.subscribe(marcador => {
            console.log(marcador)
        });
       
    }, [nuevoMarcador$]);

    useEffect(() => {
        movimientoMarcador$.subscribe(m => {
            console.log(m)
        })
    }, [movimientoMarcador$])


    return (
        <>
            <div className="info">
                Lng: {coords.lng} | Lat: {coords.lat} | Zoom: {coords.zoom}
            </div>
           <div
            ref={setRef}
            className="mapContainer"
           />
            
          
        </>
    )
}
