export class DeserializeException extends Error {
  constructor({ className, sourceString, causeError, message }) {
    const errorMessage =
      message ||
      `cannot deserialize ${className} from string '${sourceString}'. Due to: \n ${causeError}`

    super(errorMessage)
    // TODO: check stack
    this.stack = new Error().stack
    this.name = this.constructor.name
  }
}
