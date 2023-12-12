import Alpine from 'alpinejs';

const askUser = () => {
    if (confirm('Are you sure you want to save this thing into the database?')) {
        // Save it!
        console.log('Thing was saved to the database.');
      } else {
        // Do nothing!
        throw new Error("Something went badly wrong!");
        console.log('Thing was not saved to the database.');
      }
      
}


// create a plugin store by use of alpinejs – name the store like the folder of your plugin
const initialize = async (buttonDomOrder) => {    
    Alpine.store('mapSourceWarning', { });
    Alpine.store('pluginStatus').increasePluginLoadingStatus();
};


export { initialize, askUser };





