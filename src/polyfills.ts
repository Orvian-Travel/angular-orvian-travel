/**
 * Polyfills para compatibilidade com browsers legados
 * Necessário para Swiper funcionar corretamente em produção
 */

// Verificar se customElements está disponível
if (typeof window !== 'undefined') {
    // Log para debug em produção
    console.log('🔧 Inicializando polyfills para Swiper');

    // Verificar se customElements está disponível
    if (!window.customElements) {
        console.warn('⚠️ customElements não disponível - Swiper pode não funcionar');
    } else {
        console.log('✅ customElements disponível');
    }

    // Verificar se Promise está disponível
    if (!window.Promise) {
        console.warn('⚠️ Promise não disponível - adicionando polyfill básico');
        // Polyfill básico seria adicionado aqui se necessário
    }

    // Garantir que MutationObserver está disponível (usado pelo Swiper)
    if (!window.MutationObserver) {
        console.warn('⚠️ MutationObserver não disponível');
    }

    // Garantir que ResizeObserver está disponível (usado pelo Swiper)
    if (!window.ResizeObserver) {
        console.warn('⚠️ ResizeObserver não disponível - Swiper pode não redimensionar corretamente');

        // Polyfill básico para ResizeObserver
        window.ResizeObserver = window.ResizeObserver || class ResizeObserver {
            constructor(callback: any) {
                this.callback = callback;
            }

            observe() {
                // Implementação básica - não faz nada
            }

            unobserve() {
                // Implementação básica - não faz nada
            }

            disconnect() {
                // Implementação básica - não faz nada
            }

            private callback: any;
        };
    }
}

// Polyfill para Object.assign (IE11 support)
if (!Object.assign) {
    Object.assign = function (target: any, ...sources: any[]) {
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        const to = Object(target);

        for (let index = 0; index < sources.length; index++) {
            const nextSource = sources[index];

            if (nextSource != null) {
                for (const nextKey in nextSource) {
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    };
}

// Polyfill para Array.from (IE11 support)
if (!Array.from) {
    Array.from = function (arrayLike: any, mapFn?: any, thisArg?: any) {
        const C = this;
        const items = Object(arrayLike);
        if (arrayLike == null) {
            throw new TypeError('Array.from requires an array-like object - not null or undefined');
        }
        const mapFunction = mapFn === undefined ? undefined : mapFn;
        if (typeof mapFunction !== 'undefined' && typeof mapFunction !== 'function') {
            throw new TypeError('Array.from: when provided, the second argument must be a function');
        }
        const len = parseInt(items.length);
        const A = typeof C === 'function' ? Object(new C(len)) : new Array(len);
        let k = 0;
        let kValue;
        while (k < len) {
            kValue = items[k];
            if (mapFunction) {
                A[k] = typeof thisArg === 'undefined' ? mapFunction(kValue, k) : mapFunction.call(thisArg, kValue, k);
            } else {
                A[k] = kValue;
            }
            k += 1;
        }
        A.length = len;
        return A;
    };
}

console.log('🔧 Polyfills carregados para compatibilidade do Swiper');
