export default function getSignUpMessage(message) {
  if (!message) {
    return null
  }

  switch (message) {
    case "invite":
      return "You will be automatically added to the team once you've signed up."
  }

  return null;
}