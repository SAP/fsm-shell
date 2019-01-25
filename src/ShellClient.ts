
export class ShellCleint {

  constructor() {
    // dummy constructor implementation for build testing
    console.log('constructing new ShellClient ');
  }
 
  public emit<T>(event: string, data: T) {
    // dummy method implementation for build testing
    console.log(`emitting event ${event}`, data);
  }

}
