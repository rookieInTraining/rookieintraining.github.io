# Understanding the Selenium Webdriver

> Discover how Selenium works behind the scenes. While many test automation pros use it, few grasp its inner workings. Gain insider knowledge here.

- URL: https://ishabbi.tech/posts/understanding-selenium-webdriver/
- Published: 2020-02-19
- Updated: 2026-10-26
- Tags: Selenium, Webdriver, Testautomation, Webdriver Protocol

Over the course of time, my pursuit for understanding the internals of Selenium compelled me to crawl the corners of the internet in search for answers. I was searching for something that can help me connect the dots between the the browser and selenium.

With countless blogs and documentation fuelling my experiments, here is what I’ve been able to learn of the WebDriver and the [W3C WebDriver Protocol](https://w3c.github.io/webdriver/).

## What is a WebDriver?

According to the selenium documentation :

> WebDriver drives a browser natively, as a user would, either locally or on a remote machine using the Selenium server, marks a leap forward in terms of browser automation.
> 
> Selenium WebDriver refers to both the language bindings and the implementations of the individual browser controlling code. This is commonly referred to as just WebDriver.
> 
> Selenium WebDriver is a W3C Recommendation

To further simplify the understanding, I define the WebDriver as :

> WebDriver is a server sitting between the test code and the browser imitating user actions.
> 
> It implements a set of REST-ish like APIs mentioned as part of the W3C WebDriver Protocol which perform the relevant actions such as clicks, sending text to input, etc as per the specifications.
> 
> These implementations are generally based on the browsers. Eg : Chrome and Firefox have a totally different implementation of the same set of standards. Hence, the requirement of GeckoDriver and ChromeDriver.

## Running the WebDriver locally :

In order for the code to interact with the browser, it relevant WebDriver need to be started. As mentioned previously, this will help us in serving the actions we want to automate on the browser. In this example, we’ll be using Chrome whose’s WebDriver instance can be started using the below command :

```shell
./chromedriver --port 9515
```

This starts the instance of the WebDriver which can be used to automate browser actions. Here, the driver is listening to the port ***9515***, so all the request we make should be directed on the same port.

## Interacting with the WebDriver :

Now, in order to start a new instance of the browser, one needs to send a POST request to the ***/session*** endpoint along with the capabilities of the browser.

```shell
curl -v -XPOST "http://localhost:9515/session" -d '{"capabilities":{"firstMatch":[{"browserName":"chrome","goog:chromeOptions":{"args":[],"excludeSwitches":["enable-automation"],"extensions":[],"prefs":{"credentials_enable_service":false,"profile.default_content_setting_values.notifications":1,"profile.default_content_settings.popups":0,"profile.password_manager_enabled":false}}}]},"desiredCapabilities":{"browserName":"chrome","goog:chromeOptions":{"args":[],"excludeSwitches":["enable-automation"],"extensions":[],"prefs":{"credentials_enable_service":false,"profile.default_content_setting_values.notifications":1,"profile.default_content_settings.popups":0,"profile.password_manager_enabled":false}}}}'
```

The output of which gives me the session id of the browser, which in turn is used in performing the user actions. The output of the command above gave the following response :

```json
{
  "value": {
    "capabilities": {
      "acceptInsecureCerts": false,
      "browserName": "chrome",
      "browserVersion": "81.0.4044.138",
      "chrome": {
        "chromedriverVersion": "81.0.4044.69 (6813546031a4bc83f717a2ef7cd4ac6ec1199132-refs/branch-heads/4044@{#776})",
        "userDataDir": "/var/folders/mx/qj98dnwj50vfpk4gr8z0__jr0000gn/T/.com.google.Chrome.B4BYFs"
      },
      "goog:chromeOptions": {
        "debuggerAddress": "localhost:65302"
      },
      "networkConnectionEnabled": false,
      "pageLoadStrategy": "normal",
      "platformName": "mac os x",
      "proxy": {

      },
      "setWindowRect": true,
      "strictFileInteractability": false,
      "timeouts": {
        "implicit": 0,
        "pageLoad": 300000,
        "script": 30000
      },
      "unhandledPromptBehavior": "dismiss and notify",
      "webauthn:virtualAuthenticators": true
    },
    "sessionId": "8294d507e58e23d05cb03cfd26540530"
  }
}
```

With the session id with me, I can now use it to further automate the browser action like navigating to a webpage, for which we need to hit the ***/session/{sessionId}/url*** endpoint along with the url as payload :

```shell
curl -v -XPOST "http://localhost:9515/session/8294d507e58e23d05cb03cfd26540530/url" -d '{"url" : "https://www.amazon.com"}'
```

The response of which after successfully navigating to the url (in this case amazon) is null as per the specification if things are fine.

```json
{"value":null}
```

And the same session id can be used to delete my browser session by sending the ***DELETE*** request to the ***/session/{sessionId}*** endpoint, effectively quitting my browser :

```shell
curl -XDELETE "http://localhost:9515/session/8294d507e58e23d05cb03cfd26540530"
```

The response of which is again null as per the specification.

```json
{"value":null}
```

## The above example give better insights of the working of selenium. The session that it creates and how that is used w.r.t the automation of user actions. Hope this article finds its way for the curious soul searching for answers.
