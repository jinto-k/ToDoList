using ToDoList.Models;

namespace ToDoList.Interfaces
{
    public interface IToDoService
    {
        Task<IEnumerable<ToDo>> GetAllToDos();
    }
}
