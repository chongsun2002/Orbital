interface Window {
    google: {
        accounts: {
            id: {
                initialize: (options: { client_id: string; callback: (response: any) => void }) => void;
                renderButton: (element: HTMLElement, options: { theme: string; size: string; width: number }) => void;
                prompt: () => void;
            };
        };
    };
}

declare namespace Cypress {
    interface Chainable<Subject = any> {
      loginByGoogleApi(): Chainable<any>;
      login(): Chainable<any>;
    }
    interface JQuery{
        body: any
    }
}