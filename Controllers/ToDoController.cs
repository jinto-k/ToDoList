using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ToDoList.Data;
using ToDoList.Interfaces;
using ToDoList.Models;

namespace ToDoList.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ToDoController : ControllerBase
    {
        private readonly IToDoService _service;
        public ToDoController(IToDoService toDoService)
        {
            _service = toDoService;
        }
        [HttpGet(Name = "GetAllToDos")]
        public  async Task<IActionResult> GetAllToDos()
        {
            var toDos= await _service.GetAllToDos();
            return Ok(toDos);
        }

        [HttpGet("{id}", Name = "GetToDoById")]
        public async Task<IActionResult> GetToDoById(int id)
        {
            var toDo = await _service.GetToDoById(id);
            return Ok(toDo);
        }
        [HttpPost("save")]
        public async Task<IActionResult> SaveToDo(ToDo toDo)
        {
            return Ok(await _service.SaveToDo(toDo));
        }
    }
}
