/**
 * StageElement
 * Elements used to show an item on screen
 * Runned element
 */
 export class Element{
   constructor(
     public content: string,
     public additional: Array<string> = Array()
   ){}


 /**
  * TXT: Instantiate a qr code waiter
  *
  * @param content : text text
  */
  public static txtAdditionalLabels(): string[]{
    return [];
 }


/**
 * IMG: Instantiate an image
 *
 * @param content : image name
 */
 public static imgAdditionalLabels(): string[]{
  return [];
}

 /**
  * BTN: Instantiate a button
  *
  * @param content : text of button (will be the name of the listener)
  * @param additional = 1 - name of under stage to run
  */
  public static btnAdditionalLabels(): string[]{
    return ['name of under stage to run'];
 }

/**
 * EDT: Instantiate a edit text
 *
 * @param content : text to show
 *  @param Additional (3) = 1- name of under stage to run / 2 -  answer possible / 3 - answer possible
 */

 public static edtAdditionalLabels(): string[]{
  return ['name of under stage to run',
'possible answer',
'possible answer'];
}

/**
 * ETP: Instantiate an Phase
 *
 * @param content : step id
 */
 public static etpAdditionalLabels(): string[]{
  return [];
}


/**
 * QRC: Instantiate a qr code waiter
 *
 * @param content : qr content = name of the under stage to run
 */
 public static qrcAdditionalLabels(): string[]{
  return [];
}

/**
 * TST: Instantiate a toast
 *
 * @param content : toast text
 */
 public static tstAdditionalLabels(): string[]{
  return [];
}

/**
 * LCK: Instantiate a lock
 *
 * @param content : lock id
 */
 public static lckAdditionalLabels(): string[]{
  return [];
}

/**
 * UCK: Instantiate an unlock
 *
 * @param content : lock name
 *
 */
 public static uckAdditionalLabels(): string[]{
  return [];
}

/**
 * VAR: Instantiate a variables
 *
 * @param content : variables content : "var=value"
 */
 public static varAdditionalLabels(): string[]{
  return [];
}
 }
