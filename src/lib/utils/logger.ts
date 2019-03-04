/**
 *
 * @param data T a development logger  that logs to stderr and stdout
 * @param prodLog boolean Set it to true if you want to log during production
 */
export default function <T>(data: T, prodLog?: boolean): void {
  if (process.env.NODE_ENV === 'development' || prodLog === true) {
    if (data instanceof Error) {
      process.stderr.write(`${data.message}\n`);
    } else {
      process.stdout.write(`${JSON.stringify(data)}\n`);
    }
  }
}
