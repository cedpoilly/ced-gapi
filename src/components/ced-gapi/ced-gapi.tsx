import { Component, h, Prop, State, Method } from "@stencil/core";

import { gapiPromise } from "../../gapi/load-script";
import GoogleAuthService from "../../gapi/google-auth-service";

const googleAuthService = new GoogleAuthService();
const {
  login,
  logout,
  isAuthenticated,
  getUserData,
  refreshToken
} = googleAuthService;

@Component({
  tag: "ced-gapi",
  styleUrl: "ced-gapi.css",
  shadow: true
})
export class CedGAPI {
  @Prop({ mutable: true, reflect: true }) gapi = null;
  @Prop() clientConfig = null;

  @State() gapiLoadClientPromise = null;

  async connectedCallback() {
    await gapiPromise;

    // @ts-ignore
    if (!window.gapi) {
      console.error("Failed to load GAPI!");
      return;
    }

    // @ts-ignore
    this.gapi = window.gapi;
  }

  @Method()
  initialise(config: {}) {
    return new Promise(resolve => {
      var intervalRef = setInterval(function testReadiness() {
        if (this.gapi) {
          clearInterval(intervalRef);

          if (!this.gapi.auth) {
            this.gapi.load("client:auth2", async () => {
              this.gapiLoadClientPromise = await this.gapi.client.init(config);
              console.info("gapi client initialised.");

              googleAuthService.authInstance = this.gapi.auth2.getAuthInstance();

              resolve(this.gapi);
            });
          } else {
            resolve(this.gapi);
          }
        }
        // interval logic could be optimised ...
      }, 100);
    });
  }

  @Method()
  async getClient() {
    return this.gapi;
  }

  @Method()
  async login() {
    const client = await this.gapi;
    return login(client);
  }

  @Method()
  async logout() {
    const client = await this.gapi;
    return logout(client);
  }

  @Method()
  async refreshToken() {
    const client = await this.gapi;
    return refreshToken(client);
  }

  @Method()
  async isAuthenticated() {
    return isAuthenticated;
  }
  @Method()
  async getUserData() {
    return getUserData;
  }

  render() {
    return <span>✌🏽</span>;
  }
}
