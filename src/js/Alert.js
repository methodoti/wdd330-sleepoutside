export default class Alert {
  constructor(message, background, color) {
    this.message = message;
    this.background = background;
    this.color = color;
  }

  // Pulls any and all alerts from the JSON file and returns them as an array of objects.
  async getAlerts() {
    const response = await fetch('/json/alerts.json');
    const alerts = await response.json();
    return alerts;
  }

  // Takes an alert object and returns a string of HTML to be rendered on the page.
  alertTemplate(alert) {
    const newAlert = `<p style="background: ${alert.background}; color: ${alert.color};">${alert.message}</p>`;
    return newAlert;
  }

  // Takes an array of alert objects and a parent element, creates HTML for each alert, and inserts it into the parent element.
  displayAlerts(alerts, parentElement) {
    // Runs through the array of alerts and creates an array of HTML strings.
    const htmlAlerts = alerts.map((alert) => this.alertTemplate(alert));
    // Joins the array of HTML strings and inserts it into the parent element.
    parentElement.innerHTML = htmlAlerts.join('');
  }

  // Initializes the alert system by fetching alerts and rendering them on the page if any exist.
  async init() {
    // Fetch the alerts from the JSON file.
    const alerts = await this.getAlerts();

    // If there are any alerts, a container is created for them.
    if (alerts.length > 0) {
      const alertContainer = document.createElement('section');
      alertContainer.classList.add('alert-list');

      // The alerts are rendered inside the container, and the container is inserted at the top of the main element of the page.
      this.displayAlerts(alerts, alertContainer);
      document.querySelector('main').prepend(alertContainer);
    }
  }
}
