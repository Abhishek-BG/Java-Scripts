
class main{

    public int add(int a, int b)
    {
        System.out.println(a+b);
            return a+b;
    }
    
    public int add(int a, int b, int c)
    {
        System.out.println(a+b+c);
        return a+b+c;
    }
    public void overriding()
    {
      System.out.println("This is overriding fun");
    }
       
}
class classtwo extends main{
    public void overriding()
    {
        System.out.println("This is Overridden");
    }
    public static void main(String [] args)
    {
        classtwo obj = new classtwo( );
        obj.overriding();
        obj.add(4,5);  
        obj.add(4,5,6);
    }
}
/* 
#write a program to find the are of a triangle rectangle and circumference of a circle using
multilevel inheritance
#take email and password and name has input encapuslate the data and modify and access it 
using objects 
*/