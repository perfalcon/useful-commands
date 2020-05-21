**Modules in an AEM project**

***core:***
The core module contains all of the Java code associated with the project. 
When built it deploys an OSGi bundle to AEM. 

***Ui.apps:***
The ui.apps maven module contains all of the rendering code needed for the site beneath /apps . 
This includes CSS/JS that will be stored in an AEM format called clientlibs . 
This also includes HTL scripts for rendering dynamic HTML. 
You can think of the ui.apps module as a map to the structure in the JCR but in a format that can be stored on a file system and committed to source control. 
The ui.apps module only contains code. 

***Ui.content modules:***
The ui.content module is structured the same way as the ui.apps module. 
The only difference is that the ui.content module contains what is known as mutable content. 
Mutable content essentially refers to non-code configurations like Templates, Policies, or folder structures that is stored in source-control but could be modified on an AEM instance directly. 
This will be explored in much more detail in the chapter on Pages and Templates. For now the important takeaway is that the same Maven commands used to build the ui.apps module can be used to build the ui.content module. 

***Ui.frontend module:***
The ui.frontend module is a Maven module that is actually a webpack project. 
This module is set up to be a dedicated front-end build system that outputs JavaScript and CSS files, which are in turn deployed to AEM. 
The ui.frontend module allows developers to code with languages like Sass , TypeScript , use npm modules and integrate the output directly into AEM.
The ui.frontend module will be covered in far more detail in the chapter on client-side libraries and front-end development. 


---
***Component Authoring***
Components can be thought of as small modular building blocks of a web page. In order to re-use components, the components must be configurable. This is accomplished via the author dialog. Next we will author a simple component and inspect how values from the dialog are persisted in AEM

***HTML Template Language (HTL)***
HTML Template Language or HTL is a light-weight, server-side templating language used by AEM components to render content. 

***Sling Models***
Sling Models are annotation driven Java "POJO's" (Plain Old Java Objects) that facilitate the mapping of data from the JCR to Java variables, and provide a number of other niceties when developing in the context of AEM. 

***Client-Side Libraries***
Client-Side Libraries, clientlibs for short, provides a mechanism to organize and manage CSS and JavaScript files necessary for an AEM Sites implementation. Client-side libraries are the standard way to include CSS and JavaScript on a page in AEM

***Experience Fragments***
Experience Fragments, allow us to combine multiple components to create a single, reference-able, component. Experience Fragments have the advantage of supporting multi-site management and allows us to manage different headers/footers per locale.

*** Page Template ***
When creating a page you must select a template, which will be used as the basis for creating the new page. The template defines the structure of the resultant page, initial content, and allowed components.
There are 3 main areas of Editable Templates :

    **** Structure **** - defines components that are a part of the template. These will not be editable by content authors.
    **** Initial Content **** - defines components that the template will start with, these can be edited and/or deleted by content authors
    **** Policies **** - defines configurations on how components will behave and what options authors will have available. 
