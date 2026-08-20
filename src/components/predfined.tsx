import { Modo, Tag } from "./chat/types";

export const welcome_msg = `¡Hola! Soy Normita, tu asistente virtual. Con una instrucción clara y breve contexto, puedo:

- **Buscar** Leyes, Ordenanzas, Decretos, Resoluciones, Convenios, Memos y Procedimientos.
- **Redactar** borradores de Ordenanzas o Decretos basados en tu información.

Consultá el instructivo (arriba a la derecha) para conocer mis alcances.

¿En qué te ayudo hoy?`;

/**
 * Configuración visual de cada modo. La clave es la que devuelve el backend
 * en `modos`; permite renombrar el modo o cambiar su inicial sin tocar el modo
 * en sí. Un modo que no figure acá se muestra con su `nombre` del backend y la
 * primera letra como inicial.
 */
export const tag_styles: Record<string, Partial<Omit<Tag, "clave">>> = {
    "": {
        name: "Normativo",
        letter: "N",
    },
    redmine: {
        name: "Redmine",
        letter: "R",
    },
};

/** Modos asumidos cuando el backend no informa ninguno. */
export const default_modos: Modo[] = [{ clave: "", nombre: "Normativo" }];

/** Construye los tags visibles a partir de los modos habilitados del usuario. */
export function buildTags(modos?: Modo[]): Tag[] {
    const source = modos?.length ? modos : default_modos;
    return source.map(({ clave, nombre }) => {
        const style = tag_styles[clave] ?? {};
        const name = style.name ?? nombre;
        return {
            clave,
            name,
            letter: style.letter ?? name.charAt(0).toUpperCase(),
        };
    });
}
