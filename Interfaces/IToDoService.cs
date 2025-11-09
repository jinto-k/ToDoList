using ToDoList.Models;

namespace ToDoList.Interfaces
{
    public interface IToDoService
    {
        Task<IEnumerable<ToDo>> GetAllToDos();
        Task<ToDo> GetToDoById(int id);
        Task<int> SaveToDo(ToDo toDo);
        Task<bool> DeleteToDo(int id);
        Task<bool> SetCompleted(int id, bool isCompleted);
    }
}
