import { PluginOption } from 'vite';

// const importTILIndex = () => {}
// const importTILContents = () => {}

export const tilRouteGenerator = (): PluginOption => {
    return {
        name: 'til-route-generator',
        apply: () => true,
        buildStart(a) {
            console.log('a:', a);

        },
    };
};