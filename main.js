import './style.css';
import 'tippy.js/dist/tippy.css';
import "bootstrap/dist/css/bootstrap.min.css";

import { getEnabledPluginNames, loadPlugins } from './pluginLoader.js';
import { map, view } from './components/core/mapSetup/mapSetup.js';

import Alpine from 'alpinejs';
import Tooltip from "@ryangjchandler/alpine-tooltip";
import { emitCustomEvent } from './components/core/helper.js';
import loader from './components/core/loadIndicator/loadIndicator.js';
import persist from '@alpinejs/persist';

// Initialize Alpine.js
window.Alpine = Alpine;
Alpine.plugin(persist);
Alpine.plugin(Tooltip);
Alpine.start();

// Initialize loader
loader();

const enabledPlugins = getEnabledPluginNames();

// Initialize Alpine Store
initAlpineStore();

// Event Listener for Map Layer Loading
document.addEventListener('featureMaplayersFinished', handleMapLayerFinish);

// Function Definitions Below

async function loadParentComponents() {
    try {
        const parentPromises = loadPlugins(map, view, true);
        await Promise.all(parentPromises);
        console.log("Finished loading all parent components");
        return parentPromises.length;
    } catch (error) {
        console.error('Error in loading parent components:', error);
        return 0;
    }
}

async function loadChildComponents() {
    try {
        const childPromises = loadPlugins(map, view, false);
        await Promise.all(childPromises);
        console.log("Finished loading all non-parent components");
        return childPromises.length;
    } catch (error) {
        console.error('Error in loading non-parent components:', error);
        return 0;
    }
}

async function handleMapLayerFinish(event) {
    console.debug('Main.js received featureMaplayersFinished event');

    const parentCount = await loadParentComponents();
    const childCount = await loadChildComponents();
    const totalPlugins = parentCount + childCount;

    console.log(`Total plugins loaded: ${totalPlugins}`);
    checkPluginLoadingCompletion(totalPlugins);
}

function initAlpineStore() {
    Alpine.store('pluginStatus', {
        registeredPluginsCount: 0,
        mapClickEnabled: true,
        registeredPluginNames: enabledPlugins.join(', '),
        increasePluginLoadingStatus() {
            this.registeredPluginsCount++;
        },
        closeAllOffcanvas(currentComponentName) {
            enabledPlugins.forEach(pluginName => {
                if (pluginName !== currentComponentName) {
                    Alpine.store(pluginName).componentIsActive = false;
                }
            });
        }
    });

    // Initialize store for each enabled plugin
    enabledPlugins.forEach(pluginName => {
        Alpine.store(pluginName, { componentIsActive: false });
    });
}

function checkPluginLoadingCompletion(totalPlugins) {
    Alpine.effect(() => {
        if (Alpine.store('pluginStatus').registeredPluginsCount === totalPlugins) {
            const allPluginsFinishedLoadingEvent = new Event('allPluginsFinishedLoading');
            document.dispatchEvent(allPluginsFinishedLoadingEvent);
            console.debug(`${totalPlugins} plugins finished loading`);
            emitCustomEvent('hideLoading', {});
        }
    });
}
